export type DimensionProps = {width: number, height: number};

export function Loading({width, height}: DimensionProps) {
    return (
        <div style={{width, height, display: "flex", justifyContent: "center", alignItems: "center"}}></div>
    );
}