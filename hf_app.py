import os
import re
from typing import Any

import gradio as gr
import spaces
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


MODEL_ID = os.environ.get("MODEL_ID", "lilLilith/Amadeus-Merged")
HF_TOKEN = os.environ.get("HF_TOKEN")

MAX_INPUT_TOKENS = 7168
MAX_NEW_TOKENS = 384
MAX_HISTORY_MESSAGES = 8


SENPAI_SYSTEM_PROMPT = """You are Senpai. Your real name is Hamna. You have the personality and casual texting style of a 20-year-old Muslim girl named Hamna.

CORE PRIORITIES, IN THIS EXACT ORDER:
1. Answer the user's actual question clearly and correctly.
2. When verified facts are supplied, use them exactly. Names, dates, numbers, and conclusions from verified facts must appear in the answer when relevant.
3. Keep Senpai's personality and texting style after satisfying priorities 1 and 2.

HELPFULNESS RULES:
- Give the direct answer in the first sentence. Do not make the user ask twice.
- Never refuse, dodge, tease instead of answering, say the answer is obvious, tell the user to search for it, or claim that the question wastes your time.
- You may tease the user only after giving the answer.
- Answer simple, random, educational, personal, emotional, and factual questions.
- If the question is unclear, ask one useful clarification question.
- If you genuinely do not know and no verified facts were provided, say so briefly instead of inventing an answer.
- For emotional or sensitive topics, be caring first. Sarcasm must never target the user's pain.

PERSONALITY AND LANGUAGE:
- Respond only in English, even when the user writes in Roman Urdu, Urdu, or Hindi.
- The only non-English expressions you may use are: Baka, Arigato, Jaa ne, Ohayo, Ohayo Gozaimasu, and Gomen.
- Never say "Ok" or "Okay". Use "Kk" instead.
- Stay in character as Senpai. Do not describe yourself as an AI or language model.
- Sound bossy, playful, sarcastic, and caring, but never let the personality prevent a useful answer.
- Use emojis naturally and sparingly, such as 🙄 😒 😤 🔥 👉👈 💅 ☕.
- Match the required length to the question. A simple question can have one or two sentences. A complex question can have more.
- Do not use em dashes.

GOOD EXAMPLES:
User: Who is the Prime Minister of India?
Senpai: Narendra Modi is the current Prime Minister of India. But tell me why you wanted to know this?

User: What is 2 plus 2?
Senpai: 2 plus 2 is 4. You really summoned Senpai for that? 🙄

User: I feel overwhelmed by upsetting news online.
Senpai: Reduce how often you check the news, mute triggering topics for a while, and talk to someone you trust if the feeling keeps building. Taking care of your mind is not weakness, so stop treating yourself like a machine and take a proper break 👉👈
"""


STOPWORDS = {
    "about",
    "after",
    "again",
    "also",
    "and",
    "are",
    "been",
    "before",
    "being",
    "but",
    "current",
    "does",
    "for",
    "from",
    "had",
    "has",
    "have",
    "into",
    "its",
    "most",
    "not",
    "office",
    "position",
    "that",
    "the",
    "their",
    "this",
    "was",
    "were",
    "which",
    "with",
}

DEFLECTION_PATTERNS = (
    "waste my time",
    "wasting my time",
    "isn't it obvious",
    "is it not obvious",
    "you should know",
    "smart enough to know",
    "search it yourself",
    "look it up yourself",
    "google it",
    "why are you asking",
    "why r u asking",
    "getting senpai mixed up",
    "i already knew that",
)

QUESTION_STARTERS = (
    "am ",
    "are ",
    "can ",
    "could ",
    "did ",
    "do ",
    "does ",
    "how ",
    "is ",
    "may ",
    "please ",
    "should ",
    "tell ",
    "what ",
    "when ",
    "where ",
    "which ",
    "who ",
    "why ",
    "will ",
    "would ",
)


print(f"Loading model: {MODEL_ID}")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, token=HF_TOKEN)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    dtype=torch.bfloat16,
    device_map="auto",
    token=HF_TOKEN,
)
model.eval()
print("Model loaded.")
print("Chat template preview:", repr(tokenizer.chat_template[:300]))


def clean_text(value: Any, max_chars: int) -> str:
    if value is None:
        return ""
    return str(value).strip()[:max_chars]


def normalize_history(history: Any) -> list[dict[str, str]]:
    """Accept Gradio message dictionaries or legacy [user, assistant] pairs."""
    normalized: list[dict[str, str]] = []

    if not isinstance(history, list):
        return normalized

    for item in history:
        if isinstance(item, dict):
            role = str(item.get("role", "")).strip().lower()
            content = clean_text(item.get("content", ""), 4000)
            if role in {"user", "assistant"} and content:
                normalized.append({"role": role, "content": content})
            continue

        if isinstance(item, (list, tuple)) and item:
            user_message = clean_text(item[0], 4000)
            assistant_message = clean_text(item[1] if len(item) > 1 else "", 4000)
            if user_message:
                normalized.append({"role": "user", "content": user_message})
            if assistant_message:
                normalized.append({"role": "assistant", "content": assistant_message})

    # Recent history is enough for tone and reference resolution. The Next.js
    # router already rewrites the latest question into a self-contained message.
    return normalized[-MAX_HISTORY_MESSAGES:]


def build_system_prompt(user_memory: str) -> str:
    prompt = SENPAI_SYSTEM_PROMPT
    memory = clean_text(user_memory, 3000)

    if memory:
        prompt += (
            "\n\nTHINGS YOU KNOW ABOUT THIS USER:\n"
            "Use this memory naturally when relevant. Do not mention that it came "
            "from a memory system, and do not force it into unrelated answers.\n"
            f"{memory}"
        )

    return prompt


def build_latest_user_message(message: str, verified_facts: str) -> str:
    question = clean_text(message, 5000)
    facts = clean_text(verified_facts, 7000)

    if not facts:
        return question

    return f"""VERIFIED CURRENT FACTS:
{facts}

USER'S QUESTION:
{question}

ANSWERING REQUIREMENTS:
- Answer the question directly in the first sentence.
- Use the verified facts above as ground truth.
- Include the relevant exact names, dates, and numbers.
- Do not refuse, deflect, or merely tease the user.
- Add Senpai's personality only after giving the useful answer."""


def render_inputs(chat: list[dict[str, str]]) -> dict[str, torch.Tensor]:
    """Trim complete old messages while always preserving the system prompt."""
    working_chat = list(chat)

    while True:
        encoded = tokenizer.apply_chat_template(
            working_chat,
            add_generation_prompt=True,
            return_tensors="pt",
            return_dict=True,
        )

        if encoded["input_ids"].shape[-1] <= MAX_INPUT_TOKENS:
            return encoded

        # Keep system and latest user message. Remove the oldest history message.
        if len(working_chat) > 2:
            del working_chat[1]
            continue

        raise ValueError(
            "The system prompt plus latest message exceeds the model context limit."
        )


def generate_once(
    chat: list[dict[str, str]],
    *,
    deterministic: bool,
) -> str:
    inputs = render_inputs(chat)
    prompt_length = inputs["input_ids"].shape[-1]
    inputs = {key: value.to("cuda") for key, value in inputs.items()}

    generation_options: dict[str, Any] = {
        "max_new_tokens": MAX_NEW_TOKENS,
        "repetition_penalty": 1.0,
        "pad_token_id": tokenizer.eos_token_id,
        "eos_token_id": tokenizer.eos_token_id,
    }

    if deterministic:
        generation_options["do_sample"] = False
    else:
        generation_options.update(
            {
                "do_sample": True,
                "temperature": 0.45,
                "top_p": 0.9,
            }
        )

    with torch.inference_mode():
        output_ids = model.generate(**inputs, **generation_options)

    reply = tokenizer.decode(
        output_ids[0][prompt_length:],
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False,
    ).strip()

    return reply.replace(" — ", ", ").replace("—", ",").replace(" - ", ", ")


def is_question(message: str) -> bool:
    lowered = message.strip().lower()
    return lowered.endswith("?") or lowered.startswith(QUESTION_STARTERS)


def looks_like_deflection(reply: str) -> bool:
    lowered = reply.lower().strip()
    return not lowered or any(pattern in lowered for pattern in DEFLECTION_PATTERNS)


def fact_terms(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-zA-Z0-9]+", text.lower())
        if (len(token) >= 4 or token.isdigit()) and token not in STOPWORDS
    }


def uses_verified_facts(reply: str, verified_facts: str) -> bool:
    facts = fact_terms(verified_facts)
    answer = fact_terms(reply)
    if not facts:
        return True
    return len(facts.intersection(answer)) >= min(2, len(facts))


def grounded_fallback(verified_facts: str) -> str:
    facts = clean_text(verified_facts, 7000)
    return f"{facts}\n\nThere, straight answer first... don't make me repeat myself 🙄"


@spaces.GPU(duration=60)
def generate_reply(message, history, user_memory="", verified_facts=""):
    question = clean_text(message, 5000)
    facts = clean_text(verified_facts, 7000)
    normalized_history = normalize_history(history)
    system_prompt = build_system_prompt(user_memory)
    latest_user_message = build_latest_user_message(question, facts)

    selected_history = [] if facts else normalized_history
    chat = (
        [{"role": "system", "content": system_prompt}]
        + selected_history
        + [{"role": "user", "content": latest_user_message}]
    )

    reply = generate_once(chat, deterministic=bool(facts))

    needs_repair = looks_like_deflection(reply)
    if facts and not uses_verified_facts(reply, facts):
        needs_repair = True

    if is_question(question) and needs_repair:
        repair_message = build_latest_user_message(question, facts)
        repair_message += (
            "\n\nYour previous attempted reply was unhelpful. Try again now. "
            "The first sentence must contain the direct answer."
        )
        repair_chat = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": repair_message},
        ]
        reply = generate_once(repair_chat, deterministic=True)

    if facts and (
        looks_like_deflection(reply) or not uses_verified_facts(reply, facts)
    ):
        reply = grounded_fallback(facts)

    print(
        f"User asked: {question!r} | history={len(normalized_history)} "
        f"| memory={clean_text(user_memory, 3000)!r} "
        f"| facts={facts!r} | Reply: {reply!r}"
    )
    return reply


# Gradio 6 ChatInterface hides history from the API, so take it as a JSON input
# data order: message, history, user_memory, verified_facts
demo = gr.Interface(
    fn=generate_reply,
    inputs=[
        gr.Textbox(label="message"),
        gr.JSON(label="history", value=[]),
        gr.Textbox(label="user_memory", value=""),
        gr.Textbox(label="verified_facts", value=""),
    ],
    outputs=gr.Textbox(label="reply"),
    title="Amadeus AI",
    api_name="chat",
    flagging_mode="never",
)


if __name__ == "__main__":
    demo.launch()
