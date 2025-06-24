export type WEEKDAY = "MONDAY" | "TUESDAY" | "WEDNESSDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"


export interface Todo {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    date: string;
  }