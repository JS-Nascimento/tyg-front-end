import Sidebar from '@/app/components/Sidebar';
import WorkArea from '@/app/components/WorkArea';

const Card = ({ title, description }) => (
  <div className="p-4 bg-blue-100 rounded-lg shadow-md dark:bg-blue-900">
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="mt-2 text-sm">{description}</p>
  </div>
);

export default function Home() {
  const cards = [
    { title: 'Card 1', description: 'Descrição do Card 1' },
    { title: 'Card 2', description: 'Descrição do Card 2' },
    { title: 'Card 3', description: 'Descrição do Card 3' },
  ];
  return (

    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-blue-100">
    <Sidebar logoUrl={'/tyg-logo.png'} userAvatar={"/avatar.jpg"} userName={"Jorge Nascimento"} userEmail={"sardinha.jorge@gmail.com"}>
        <WorkArea title="Dashboard">
          {cards.map((card, index) => (
            <Card key={index} title={card.title} description={card.description} />
          ))}
        </WorkArea>
      </Sidebar>
    </main>
  );
}
