export interface StatusData {
    first_name: string;
    last_name: string;
    sex: string;
    logs: LogOfStatus[];
    half_total: number;
    total_money_punish: number;
}

export interface LogOfStatus {
    agent_name_checkin_am: string;
    agent_name_checkout_am: string;
    agent_name_checkin_pm: string;
    agent_name_checkout_pm: string;
    time_checkin_am: number;
    time_checkin_pm: number;
    time_checkout_am: number;
    time_checkout_pm: number;
    learning_time_unit: number;
    missed_half_day: number;
}
