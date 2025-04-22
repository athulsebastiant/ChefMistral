import Markdown from "react-markdown";
export default function MistralRecipe(props) {
  return (
    <section>
      <h1>Chef Mistral says</h1>
      <Markdown>{props.recipe}</Markdown>
    </section>
  );
}
