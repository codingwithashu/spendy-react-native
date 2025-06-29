// types/Transaction.ts
export type Transaction = {
    id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string;
    icon: string;
};

/** Structure for stored user */
export type User = {
    name: string;
    email: string;
    password: string;
};