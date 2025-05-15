CREATE TABLE original_question (
    id INT AUTO_INCREMENT,
    content TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE standard_question (
    id INT AUTO_INCREMENT,
    content TEXT NOT NULL,
    oq_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (oq_id) REFERENCES original_question(id)
);

CREATE TABLE standard_question_tag (
    tag VARCHAR(63) NOT NULL,
    sq_id INT NOT NULL,
    PRIMARY KEY (tag, sq_id),
    FOREIGN KEY (sq_id) REFERENCES standard_question(id)
);

CREATE TABLE standard_answer (
    id INT AUTO_INCREMENT,
    sq_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sq_id) REFERENCES standard_question(id)
);

CREATE TABLE standard_answer_scorepoint (
    id INT AUTO_INCREMENT,
    scorepoint TEXT NOT NULL,
    score INT NOT NULL,
    sa_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sa_id) REFERENCES standard_answer(id)
);

CREATE TABLE candidate_answer (
    id INT AUTO_INCREMENT,
    sq_id INT NOT NULL,
    username VARCHAR(63) NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (sq_id) REFERENCES standard_question(id)
);

CREATE TABLE dataset (
    id INT AUTO_INCREMENT,
    name VARCHAR(63) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE dataset_questions (
    ds_id INT NOT NULL,
    sq_id INT NOT NULL,
    PRIMARY KEY (ds_id, sq_id)
);

CREATE TABLE dataset_version_update (
    prev_version_id INT NOT NULL,
    next_version_id INT NOT NULL,
    PRIMARY KEY (prev_version_id, next_version_id),
    FOREIGN KEY (prev_version_id) REFERENCES dataset(id),
    FOREIGN KEY (next_version_id) REFERENCES dataset(id)
);

CREATE TABLE model (
    id INT AUTO_INCREMENT,
    type VARCHAR(63) NOT NULL,
    name VARCHAR(63) NOT NULL,
    prompt_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (prompt_id) REFERENCES prompt(id)
);

CREATE TABLE prompt (
    id INT AUTO_INCREMENT,
    type VARCHAR(63) NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE assessment(
    id INT AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    total_score INT NOT NULL,
    dataset_id INT NOT NULL,
    model_id INT NOT NULL,
    referee_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (dataset_id) REFERENCES dataset(id),
    FOREIGN KEY (model_id) REFERENCES model(id),
    FOREIGN KEY (referee_id) REFERENCES model(id)
);

CREATE TABLE model_answer(
    id INT AUTO_INCREMENT,
    model_id INT NOT NULL,
    sq_id INT NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (model_id) REFERENCES model(id),
    FOREIGN KEY (sq_id) REFERENCES standard_question(id)
);

CREATE TABLE model_answer_assessment (
    id INT NOT NULL,
    total_score INT NOT NULL,
    assessment_id INT NOT NULL,
    model_answer_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (assessment_id) REFERENCES assessment(id),
    FOREIGN KEY (model_answer_id) REFERENCES model_answer(id)
);

CREATE TABLE model_answer_assess_process (
    model_answer_assessment_id INT NOT NULL,
    scorepoint_id INT NOT NULL,
    score INT NOT NULL,
    PRIMARY KEY (model_answer_assessment_id, scorepoint_id),
    FOREIGN KEY (model_answer_assessment_id) REFERENCES model_answer_assessment(id),
    FOREIGN KEY (scorepoint_id) REFERENCES standard_answer_scorepoint(id)
);
