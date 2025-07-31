interface Props {
  howToFindUs: string;
}

export default function HowToFindUs({ howToFindUs }: Props) {
  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">How to find us</h3>
      <p className="text-base">{howToFindUs}</p>
    </div>
  );
}
