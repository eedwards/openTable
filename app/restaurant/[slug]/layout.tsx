import RestaurantHeader from './components/RestaurantHeader';

export default function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <main>
      <RestaurantHeader name={params.slug} />
      <div className="flex flex-col lg:flex-row bg-white p-5 space-y-5 lg:space-y-0 lg:space-x-5">
        {children}
      </div>
    </main>
  );
}
