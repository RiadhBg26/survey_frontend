export interface UserModelServer {
    _id: any;
    email: string;
    password: string;
    surveys: any[],
    answeredSurveys: any[]
    votes: number
}

export interface UserResponse {
    count: number;
    users: UserModelServer[]
}

export interface ResponseData {
    message: string;
    expert: UserModelServer
  }

  export interface UserLoginResponse {
    token: string;
    user: UserModelServer;
    userId: any
  }
  