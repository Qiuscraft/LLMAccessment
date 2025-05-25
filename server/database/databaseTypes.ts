// server/database/databaseTypes.ts

// 原始问题表
export interface OriginalQuestion {
    id: number;
    content: string;
}

// 标准问题表
export interface StandardQuestion {
    id: number;
    content: string;
    oq_id: number;
}

// 标准问题标签表
export interface StandardQuestionTag {
    tag: string;
    sq_id: number;
}

// 标准答案表
export interface StandardAnswer {
    id: number;
    sq_id: number;
}

// 标准答案评分点表
export interface StandardAnswerScorepoint {
    id: number;
    scorepoint: string;
    score: number;
    sa_id: number;
}

// 候选答案表
export interface CandidateAnswer {
    id: number;
    sq_id: number;
    username: string;
    content: string;
}

// 数据集表
export interface Dataset {
    id: number;
    name: string;
    created_at: Date;
}

// 数据集问题关联表
export interface DatasetQuestions {
    ds_id: number;
    sq_id: number;
}

// 数据集版本表
export interface DatasetVersion {
    prev_id: number;
    next_id: number;
}

// 模型类型表
export interface ModelType {
    type: string;
}

// 提示词表
export interface Prompt {
    id: number;
    type: string;
    content: string;
}

// 模型表
export interface Model {
    id: number;
    type: string;
    name: string;
    prompt_id: number;
}

// 评估表
export interface Assessment {
    id: number;
    created_at: Date;
    total_score: number;
    dataset_id: number;
    model_id: number;
    referee_id: number;
}

// 模型答案表
export interface ModelAnswer {
    id: number;
    model_id: number;
    sq_id: number;
    content: string;
}

// 模型答案评估表
export interface ModelAnswerAssessment {
    id: number;
    total_score: number;
    assessment_id: number;
    model_answer_id: number;
}

// 模型答案评估过程表
export interface ModelAnswerAssessProcess {
    model_answer_assessment_id: number;
    scorepoint_id: number;
    score: number;
}
