export interface UserStatusData {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    join_date: Date;
    birthdate: Date;
    image_url: string;
    status: string;
}

export interface UserManagementData {
    active_users: number;
    banned_users: number;
    suspended_users: number;
    users: number;
    user_status_data: UserStatusData[];
}