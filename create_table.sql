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
    PRIMARY KEY (tag, sq_id)
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
    version_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (version_id) REFERENCES dataset_version(id)
);

CREATE TABLE dataset_questions (
    ds_id INT NOT NULL,
    sq_id INT NOT NULL,
    PRIMARY KEY (ds_id, sq_id)
);

CREATE TABLE dataset_version (
    id INT AUTO_INCREMENT,
    name VARCHAR(63) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE dataset_version_update (
    prev_version_id INT NOT NULL,
    next_version_id INT NOT NULL,
    PRIMARY KEY (prev_version_id, next_version_id),
    FOREIGN KEY (prev_version_id) REFERENCES dataset_version(id),
    FOREIGN KEY (next_version_id) REFERENCES dataset_version(id)
);