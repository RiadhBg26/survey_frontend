
//speciality models
export interface SurveyModelServer {
    _id: number;
    title: string;
    description: any
    choice: string[];
    yesPercentage: number;
    noPercentage: number
}
export interface SurveyResponse {
    count: number;
    surveys: SurveyModelServer[];
}

