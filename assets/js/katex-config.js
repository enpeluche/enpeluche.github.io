document.addEventListener("DOMContentLoaded", function() {
    renderMathInElement(document.body, {
        delimiters: [
        {left: "\\begin{equation}", right: "\\end{equation}", display: true},
        {left: "\\begin{align}", right: "\\end{align}", display: true},
        {left: "$$", right: "$$", display: true},
        {left: "$", right: "$", display: false},
        {left: "\\[", right: "\\]", display:true},
        {left: "\\(", right: "\\)", display:false}
        ],
        macros: {
            "\\ps": "\\left\\langle #1 , #2 \\right\\rangle",
            "\\K": "\\mathbb{K}" 
        }
    });
});