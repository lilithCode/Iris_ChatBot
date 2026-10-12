# Iris Dev Log

**Dev Log 1**
Today I finally started something I'd been thinking about for a while. Every AI chatbot I've used feels so polite and robotic, like it has zero aura. So I decided to make one that talks like a real person, specifically my friend "Senpai". I exported our WhatsApp chats and just stared at them for a bit, wondering what I'd gotten myself into.

**Dev Log 2**
Spent the whole day cleaning the WhatsApp export. It was around 81,000 lines of pure chaos: timestamps, "media omitted", deleted messages, random links. I wrote a script to strip all the junk out and kept only the actual conversations. My eyes hurt, but the data finally looks usable.

**Dev Log 3**
Today I turned the cleaned chats into proper training data. Senpai sends five short messages in a row instead of one long one, so I grouped consecutive messages together to keep that natural texting flow. I ended up with 12,613 dialogue samples. Seeing that number made it feel like a real project for the first time.

**Dev Log 4**
Set up my Kaggle notebook today with Unsloth and Llama-3 8B as the base model. Most of the day went into fighting configs and memory errors on the T4 x2 GPUs. After a lot of trial and error I settled on a 2048 sequence length and a 5e-5 learning rate. It finally started training without crashing, and I almost cried.

**Dev Log 5**
Training ran for 1000 steps today and I watched the loss drop from about 2.5 to 0.3. When I tested it, it replied with "Kk" and an eye roll emoji, and that's literally how Senpai texts. I sent screenshots to my friends and they were all shocked. That was the best moment of the project so far.

**Dev Log 6**
Today I exported the model in GGUF format with Q4_K_M quantization and uploaded the merged model to Hugging Face. I also set up a Space with a small Python API so I'd have something to call from a frontend. It was slow, but it worked, and that was enough for me.

**Dev Log 7**
Started the frontend today with Next.js and Tailwind. I built the main layout: a chat panel in the middle, a music player on the left, and a side panel on the right. I also added a loading screen and little send/receive sound effects, because a chatbot without sounds feels lifeless. Pushed the first commit with the UI, routing and model connection all together.

**Dev Log 8**
I didn't like how the UI looked yesterday, so today I redesigned almost all of it. I went with a soft lavender pastel theme that feels more like Iris, removed the cyber cursor and added a cute Senpai avatar that pops up with little messages. I also made the whole thing responsive so it works on phones too.

**Dev Log 9**
Music day! I replaced the old playlist with songs that match the vibe better and made new covers for each track. Some of the song links broke right after, so I fixed those, and one mp3 was way too big, so I compressed it. Small stuff, but the radio station panel feels complete now.

**Dev Log 10**
Worked on the side features today. I added memory logs so every chat gets saved as a session you can click and reopen. I also built the About modal explaining what Iris is and how she was made. It's the little things that make it feel like an actual product and not just a demo.

**Dev Log 11**
Today I connected the frontend to the real Hugging Face backend instead of the placeholder. Seeing Iris reply on my own website, in Senpai's style, felt unreal. Responses were slow, but it was talking, and I spent way too long just chatting with it.

**Dev Log 12**
Final UI touches today. I polished the About modal, updated the project links and rewrote the README with the whole training pipeline. Then I deployed it on Vercel. Iris is officially live and I shared the link with everyone.

**Dev Log 13**
Came back to Iris after a while because responses were way too slow on free CPU hosting. Today I moved the model to Hugging Face ZeroGPU, so it actually runs on a GPU now. I rewrote the backend route to call the Space through the Gradio API, with retries and fallback messages in case something fails.

**Dev Log 14**
Tried Modal as another hosting option today, to compare it with ZeroGPU. I switched the route to call a Modal endpoint with an API key. It worked, but managing two setups for two projects (Iris and Amadeus) was getting messy, and I started thinking about putting both on the same backend.

**Dev Log 15**
Big backend day. I made Iris use the exact same backend as my other project, Amadeus: the same Hugging Face ZeroGPU Space, plus a RAG pipeline. Now a small router model on Hack Club AI rewrites the question, decides whether it needs a web search, and remembers facts about the user. If it needs current info, it searches the web with Exa and passes verified facts to the model. The UI stayed exactly the same.

**Dev Log 16**
Tested the new pipeline today. I asked "who won the last cricket world cup?" and it searched, found the facts and answered "Australia" correctly. Iris knowing current events feels like a huge upgrade. But while chatting normally I noticed something weird: it kept saying "Hai haii" to everything and had no idea what we'd been talking about.

**Dev Log 17**
Spent today debugging the memory problem. The frontend was sending the chat history and the router was clearly using it, but the model was answering like every message was the first one. I asked "what did I just ask?" and got a totally random reply. Then I checked the Space's API info and found the problem: Gradio 6's ChatInterface hides the history from the API, so it was silently throwing the whole conversation away.

**Dev Log 18**
Fixed it today! I replaced ChatInterface in the Space with a gr.Interface that takes the history as a JSON input, so the conversation actually reaches the model now. I also added a history count to the logs so I can see it arriving with every message. This fixes Amadeus too, since they share the same Space. Iris finally remembers what we're talking about, and that feels like the right place to call this project complete.
