interface Props {
  howToFindUs: string;
}

export default function HowToFindUs({ howToFindUs }: Props) {
  return (
    <div className="bg-base-100 rounded-lg p-6 shadow-lg">
      <h3 className="mb-2 text-lg font-semibold">How to find us</h3>
      <p className="text-base">{howToFindUs}</p>
    </div>
  );
}
