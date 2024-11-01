import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";

import Question from "./Question";
import questions from "./questions";
import styles from "./index.module.scss";

const ConfigMyInfo = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({}); // 모든 질문을 상태로 관리

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryKey = "question_num";
  const storageKey = "answers";

  useEffect(() => {
    // question_num(query params) 관련
    const questionNum = searchParams.get(queryKey);
    if (questionNum) {
      if (sessionStorage.getItem(storageKey))
        setAnswers(JSON.parse(sessionStorage.getItem(storageKey)));
      setCurrentQuestion(Number(questionNum));
    } else {
      searchParams.set(queryKey, 0);
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleMove = (step) => {
    if (currentQuestion + step === questions.length) {
      // TODO submit
      sessionStorage.removeItem(storageKey);
      navigate("/home");
      return;
    }

    searchParams.set(queryKey, currentQuestion + step);
    setSearchParams(searchParams);
    setCurrentQuestion(currentQuestion + step);
    sessionStorage.setItem(storageKey, JSON.stringify(answers));
  };
  const isAnswered = () => {
    return answers[questions[currentQuestion].name];
  };

  return (
    <div className={styles.page}>
      {/* TODO 유저 이름 정보 get */}

      <div className={styles.topContainer}>
        <button onClick={() => handleMove(-1)} disabled={currentQuestion === 0}>
          &lt;
        </button>
        <h3>OOO님에 대해 설명해주세요</h3>
        <button onClick={() => handleMove(1)} disabled={!isAnswered()}>
          &gt;
        </button>
      </div>
      <div className={styles.progressBar}>
        <ProgressBar now={((currentQuestion + 1) / questions.length) * 100} />
      </div>
      <Question
        {...questions[currentQuestion]}
        value={answers}
        setValue={setAnswers}
      />
    </div>
  );
};

export default ConfigMyInfo;
