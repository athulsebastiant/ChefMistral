// const { HfInference } = require("@huggingface/inference");

// const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// const SYSTEM_PROMPT = `
// You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
// `;

// exports.handler = async function (event) {
//   const { ingredients } = JSON.parse(event.body || "{}");

//   const ingredientsString = ingredients.join(", ");

//   try {
//     const response = await hf.chatCompletion({
//       model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT },
//         {
//           role: "user",
//           content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
//         },
//       ],
//       max_tokens: 1024,
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         recipe: response.choices[0].message.content,
//       }),
//     };
//   } catch (err) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message }),
//     };
//   }
// };
// netlify/functions/get-recipe.js

export const handler = async (event) => {
  try {
    const { ingredients } = JSON.parse(event.body);
    const ingredientsString = ingredients.join(", ");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page`,
            },
            {
              role: "user",
              content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
            },
          ],
          max_tokens: 1024,
        }),
      }
    );

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No recipe found";

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: reply }),
    };
  } catch (err) {
    console.error("Error calling OpenRouter:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate recipe" }),
    };
  }
};
