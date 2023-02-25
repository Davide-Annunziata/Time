interface IBoss {
    create(): void;
    update(time: number, delta: number): void;
}
export default IBoss;