"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { quiz } from "../data";
import styles from "@/styles/questionnaire.module.css";

function QuizComponent() {
  return React.createElement(
    "div",
    null,
    quiz.questions.map((q) =>
      React.createElement(
        "div",
        { key: q.id },
        React.createElement("h3", null, q.question),
        React.createElement(
          "ul",
          null,
          q.answers.map((answer, index) =>
            React.createElement("li", { key: index }, answer)
          )
        )
      )
    )
  );
}

export default function Questionnaire() {
  // Alot of these are unused or only used once, but it was in the tutorial I found, I just modified it for our questionnaire page.
  const [careerGoals, setCareerGoals] = useState("");
  const [skills, setSkills] = useState("");
  const router = useRouter();

  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const removeTag = (indexToRemove) => {
    setTags((prevTags) => prevTags.filter((_, idx) => idx !== indexToRemove));
  };

  const { questions } = quiz;
  const { question, answers } = questions[activeQuestion];

  // the isAnswered function allows the user to progress if and only if they answer the question
  const isAnswered = (() => {
    switch (activeQuestion + 1) {
      case 1:
        return textInput.trim().length > 0;
      case 2:
        return dropdownValue.trim().length > 0;
      case 3:
        return tags.length > 0;
      case 4:
        return selectedOptions.length > 0;
      default:
        return selectedAnswerIndex !== null;
    }
  })();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/update-questionnaire/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            careerGoals,
            skills,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  // Select answer
  const onAnswerSelected = (answer, idx) => {
    setChecked(true);
    setSelectedAnswer(idx);
    // Somewhere here we could connect it to the backend?? I dont know how to do that though.
  };

  // Incrementing question
  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
    }
    setChecked(false);
  };

  // Note, to update questions and/or answers go to the data.js file. Everything is imported there.

  return (
    <div className={styles.container}>
      <h1>Questionnaire Page</h1>
      <div>
        <h2>
          Question:{activeQuestion + 1}/{questions.length}
        </h2>
      </div>
      <div>
        {!showResult ? (
          <div className={styles["quiz-container"]}>
            <h3 className={styles["h3"]}>
              {questions[activeQuestion].question}
            </h3>
            {(() => {
              switch (
                activeQuestion + 1 // Since each question requires a diff input type, this switch case changes the input required depending on what question the user is on
              ) {
                case 1: // Text input
                  return (
                    <div>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="inputname"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                        />
                      </div>
                      <label className="pt-1 block text-gray-500 text-sm">
                        If you are undecided, please type in "Undecided"
                      </label>
                    </div>
                  );

                case 2: // Drop down input
                  return (
                    <div className="relative w-[298px]">
                      {/* Dropdown trigger */}
                      <div
                        className="flex items-center gap-4 p-4 cursor-pointer font-semibold text-black bg-white border border-gray-300 rounded-xl relative z-10"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <span
                          className={`text-xl transition-transform ${
                            dropdownOpen ? "rotate-90" : "-rotate-90"
                          }`}
                        >
                          ›
                        </span>
                        <span>{dropdownValue || "Select an option"}</span>
                      </div>

                      {/* Dropdown list */}
                      {dropdownOpen && (
                        <ul
                          role="list"
                          className="absolute top-full left-0 right-0 max-h-80 overflow-y-auto bg-white border border-gray-300 rounded-xl mt-4 p-2 z-20 transition-all duration-300"
                        >
                          {answers.map((option, idx) => (
                            <li
                              key={idx}
                              role="listitem"
                              className="list-none w-full cursor-pointer"
                              onClick={() => {
                                setDropdownValue(option);
                                setDropdownOpen(false);
                              }}
                            >
                              <article className="border border-gray-300 rounded-lg p-4 text-sm font-medium bg-white text-justify hover:bg-gray-100 transition">
                                {option}
                              </article>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                case 3: // Tag-Style input
                  return (
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && tagInput.trim()) {
                            e.preventDefault();
                            setTags([...tags, tagInput.trim()]);
                            setTagInput("");
                          }
                        }}
                        className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Type a skill and press Enter"
                      />
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1 px-3 py-1 border border-gray-400 text-gray-700 rounded-full text-sm bg-gray-100"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(idx)}
                              className={styles.newButton}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                case 4:
                  return (
                    <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                      {answers.map((option, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option)}
                            onChange={() => toggleOption(option)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-800 text-sm">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  );

                default: // Default A, B , C , D input, will be used for when the user is undecided about their major (if we are even doing that)
                  return (
                    <>
                      {answers.map((answer, idx) => (
                        <li
                          key={idx}
                          onClick={() => onAnswerSelected(answer, idx)}
                          className={`${styles.li} ${
                            selectedAnswerIndex === idx ? styles.selected : ""
                          }`}
                        >
                          <span>{answer}</span>
                        </li>
                      ))}
                    </>
                  );
              }
            })()}

            <button
              onClick={nextQuestion}
              disabled={!isAnswered}
              className={!isAnswered ? "btn-disabled" : ""}
            >
              {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        ) : (
          <div className={styles["quiz-container"]}></div>
        )}
      </div>
    </div>
  );
}
