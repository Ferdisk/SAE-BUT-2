export function createQuestionWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("question-wrapper-flex");

    const questionContent = document.createElement("div");
    questionContent.classList.add("question-content-white");

    const actionPanel = document.createElement("div");
    actionPanel.classList.add("question-actions-side");

    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);

    return { wrapper, questionContent, actionPanel };
}
