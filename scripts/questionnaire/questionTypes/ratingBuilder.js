import { createQuestionWrapper } from "./common.js";
import { createObligatoireToggle } from "./optionFactory.js";

export function addRatingScale(isSubQuestion = false, callbacks = {}) {
    const { onQuestionRemoved = () => {} } = callbacks;
    const uniqueId = Date.now();
    let currentMax = 10;

    const { wrapper, questionContent, actionPanel } = createQuestionWrapper();

    if (!isSubQuestion) {
        const headerTitleRow = document.createElement("div");
        headerTitleRow.classList.add("header-row", "rating-header");

        const titreRating = document.createElement("textarea");
        titreRating.classList.add("titreRating");
        titreRating.placeholder = "[Question échelle de notation]";

        headerTitleRow.appendChild(titreRating);
        headerTitleRow.appendChild(createObligatoireToggle());
        questionContent.appendChild(headerTitleRow);
    }

    const headerScaleRow = document.createElement("div");
    headerScaleRow.classList.add("header-row");

    const labelScale = document.createElement("label");
    labelScale.textContent = "Notation sur : ";
    labelScale.htmlFor = `select-scale-${uniqueId}`;

    const selectScale = document.createElement("select");
    selectScale.id = `select-scale-${uniqueId}`;
    selectScale.classList.add("select-scale");

    [5, 10, 20, 50, 100].forEach((value) => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        if (value === 10) opt.selected = true;
        selectScale.appendChild(opt);
    });

    headerScaleRow.appendChild(labelScale);
    headerScaleRow.appendChild(selectScale);

    const sliderRow = document.createElement("div");
    sliderRow.classList.add("slider-container");

    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = `slider-${uniqueId}`;
    slider.min = 0;
    slider.max = currentMax;
    slider.value = Math.floor(currentMax / 2);
    slider.classList.add("rating-slider");

    const sliderValueLabel = document.createElement("label");
    sliderValueLabel.classList.add("slider-value");
    sliderValueLabel.textContent = slider.value;

    const numbersContainer = document.createElement("div");
    numbersContainer.classList.add("slider-numbers");

    const updateSliderFill = () => {
        const percent = (slider.value / slider.max) * 100;
        slider.style.backgroundImage = `linear-gradient(to right, #007bba ${percent}%, #ccc ${percent}%)`;
    };

    const generateSliderNumbers = (max) => {
        numbersContainer.innerHTML = "";
        numbersContainer.style.position = "relative";
        const step = max <= 10 ? 1 : Math.ceil(max / 10);
        for (let i = 0; i <= max; i += step) {
            const span = document.createElement("span");
            span.textContent = i;
            span.style.position = "absolute";
            span.style.left = `calc(8px + (100% - 16px) * ${i / max})`;
            span.style.transform = "translateX(-50%)";
            numbersContainer.appendChild(span);
        }
        if (max % step !== 0) {
            const span = document.createElement("span");
            span.textContent = max;
            span.style.position = "absolute";
            span.style.left = "calc(100% - 8px)";
            span.style.transform = "translateX(-50%)";
            numbersContainer.appendChild(span);
        }
    };

    updateSliderFill();
    generateSliderNumbers(currentMax);

    slider.addEventListener("input", (e) => {
        sliderValueLabel.textContent = e.target.value;
        updateSliderFill();
    });

    selectScale.addEventListener("change", (e) => {
        currentMax = parseInt(e.target.value, 10);
        slider.max = currentMax;
        slider.value = Math.floor(currentMax / 2);
        sliderValueLabel.textContent = slider.value;
        updateSliderFill();
        generateSliderNumbers(currentMax);
    });

    sliderRow.appendChild(slider);
    sliderRow.appendChild(numbersContainer);
    sliderRow.appendChild(sliderValueLabel);

    questionContent.appendChild(headerScaleRow);
    questionContent.appendChild(sliderRow);

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.classList.add("side-btn", "side-btn-delete");
    btnDelete.textContent = "-";
    btnDelete.addEventListener("click", () => {
        wrapper.remove();
        onQuestionRemoved();
    });

    actionPanel.appendChild(btnDelete);

    return wrapper;
}
