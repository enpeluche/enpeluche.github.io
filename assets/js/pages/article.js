// faire en sorte d'avoir un truc qui ajoute tous seul les span label partout

export function makeArticle () {
    const hoho = document.querySelectorAll('.example, .counterexample, .proof, .conjecture, .definition, .remark, .theorem, .proposition, .lemma, .problem, .notation, figcaption, summary');
    hoho.forEach( example => {
        example.insertAdjacentHTML("afterbegin", `
            <span class="label"></span>
        `);
    });

    const proofs = document.querySelectorAll('.proof');

    proofs.forEach(proof => {

        const endProofContainer = document.createElement('div');
        endProofContainer.className="end-proof";

        const qed = document.createElement('img');
        qed.src="/assets/icons/qed.svg";
        qed.className="qed";
        

        endProofContainer.appendChild(qed);

        proof.appendChild(endProofContainer);

    });
}
