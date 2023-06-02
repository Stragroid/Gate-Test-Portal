import { MathComponent } from "mathjax-react";

export default function Test() {
  return (
    <>
      <MathComponent tex={String.raw`\sum_{1}^{2} a^x`} />
      <p>
        A button:{" "}
        <button onclick="javascript: OpenLatexEditor('testbox','html','')">
        Open latex Editor
        </button>
      </p>

      <textarea id="testbox" rows="6" cols="60"></textarea>
      {/* <img src="http://latex.codecogs.com/gif.latex?\sum_{1}^{2}" title="\sum_{1}^{2}" /> */}
      I have launched equation editor <img src="http://latex.codecogs.com/gif.latex?b_{x}" title="b_{x}" />
    </>
  );
}
