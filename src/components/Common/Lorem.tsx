interface LoremProps {
  count?: number;
}

export default function Lorem({ count = 2 }: LoremProps) {
  const paragraphs = [
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Error culpa, molestiae autem, provident,
    aspernatur quam ratione placeat magni ex modi aliquid voluptatem nam impedit libero doloremque
    necessitatibus! Ex, rerum delectus?`,

    `Dolore fuga ipsa, enim reprehenderit itaque tempore expedita nemo eos ad laboriosam ipsum fugiat
    consequuntur modi quos ab magnam molestias quo mollitia! Sunt nam dicta eos suscipit in, tenetur
    est.`,

    `Odio eos, sint ullam, unde repudiandae sunt aliquid similique expedita laudantium deserunt ad in
    tenetur, voluptas eaque accusamus fuga dolorum ducimus perferendis culpa veniam quam asperiores!
    Tempora quasi odio nulla?`,
  ];

  return (
    <>
      {paragraphs.slice(0, count).map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </>
  );
}
