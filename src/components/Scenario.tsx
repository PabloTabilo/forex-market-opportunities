import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function Scenario() {
  return (
    <div>
      <h1>Forex Market Arbitrage Opportunities</h1>
      <h2>What’s the Problem?</h2>
      <p>
        We have a set of currencies{" "}
        <InlineMath>{String.raw`C = \{c_1, c_2, \dots, c_n\}`}</InlineMath>.
      </p>
      <p>
        And we want to select a subset{" "}
        <InlineMath>{String.raw`C_k \subseteq C`}</InlineMath> of these
        currencies, forming a path that both begins and ends at the same
        currency <InlineMath>{String.raw`c_i`}</InlineMath>, where{" "}
        <InlineMath>{String.raw`c_i \in C_k`}</InlineMath>. Starting with an
        initial amount <InlineMath>{String.raw`A`}</InlineMath>, we follow the
        given <strong>exchange rates</strong> along this path. If, upon returning to the starting
        currency, we end up with an amount{" "}
        <InlineMath>{String.raw`A'`}</InlineMath>, where {" "}
        <InlineMath>{String.raw`A' > A`}</InlineMath>, then we have achieved a <i>gain</i>—indicative of an 
        <strong>arbitrage opportunity</strong>.
      </p>
        <h2>Definitions</h2>
      <p>
        Each directed edge from currency <InlineMath>C_i</InlineMath> to{" "}
        <InlineMath>C_j</InlineMath> is associated with an exchange rate:
      </p>
      <BlockMath>{String.raw`\text{rate}_{i,j} = \frac{\text{units of }C_j}{1\,\text{unit of }C_i}.`}</BlockMath>
      <p>
        Our goal is to detect an <b>arbitrage opportunity</b>, i.e., a sequence
        of exchanges starting and ending in the same currency, resulting in more
        units than we started with.
      </p>
      <h2>From Rates to Graph Weights</h2>
      <p>
        An arbitrage cycle are easier to detect using a logarithmic
        transformation. Define:
      </p>
      <BlockMath>{String.raw`w_{i,j} = -\ln(\text{rate}_{i,j})`}</BlockMath>
    </div>
  );
}

export default Scenario;
