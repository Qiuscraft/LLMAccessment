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
    score DECIMAL(5, 2) NOT NULL,
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
    PRIMARY KEY (ds_id, sq_id),
    FOREIGN KEY (ds_id) REFERENCES dataset(id),
    FOREIGN KEY (sq_id) REFERENCES standard_question(id)
);

CREATE TABLE dataset_version (
    prev_id INT NOT NULL,
    next_id INT NOT NULL,
    PRIMARY KEY (prev_id, next_id),
    FOREIGN KEY (prev_id) REFERENCES dataset(id),
    FOREIGN KEY (next_id) REFERENCES dataset(id)
);

CREATE TABLE model_type (
    type VARCHAR(63) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE prompt (
    id INT AUTO_INCREMENT,
    type VARCHAR(63) NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (type) REFERENCES model_type(type)
);

CREATE TABLE model (
    id INT AUTO_INCREMENT,
    type VARCHAR(63) NOT NULL,
    name VARCHAR(63) NOT NULL,
    prompt_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (prompt_id) REFERENCES prompt(id),
    FOREIGN KEY (type) REFERENCES model_type(type)
);

CREATE TABLE assessment(
    id INT AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL,
    total_score DECIMAL(5, 2) NOT NULL,
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
    id INT AUTO_INCREMENT,
    total_score DECIMAL(5, 2) NOT NULL,
    assessment_id INT NOT NULL,
    model_answer_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (assessment_id) REFERENCES assessment(id),
    FOREIGN KEY (model_answer_id) REFERENCES model_answer(id)
);

CREATE TABLE model_answer_assess_process (
    model_answer_assessment_id INT NOT NULL,
    scorepoint_id INT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (model_answer_assessment_id, scorepoint_id),
    FOREIGN KEY (model_answer_assessment_id) REFERENCES model_answer_assessment(id),
    FOREIGN KEY (scorepoint_id) REFERENCES standard_answer_scorepoint(id)
);
