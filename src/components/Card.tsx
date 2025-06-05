export type Card = {
    id: number;
    name: string;
    type: 'building' | 'fort' | 'ship';
    cost: number;
}