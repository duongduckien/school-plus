export interface AgentData {
    create_at: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    role: number;
    status: number;
    update_at: number;
    grant_access: any;
}

export interface AgentValue {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    rePassword: string;
    key: string;
}
