import MainHeading from '@/components/main-heading';
import Menu from '@/components/menu';
import { db } from '@/lib/prisma';
import { getBestSellers } from '@/server/db/products';
import Image from 'next/image';

async function BestSellers() {
 const [bestSellers, allExtras] = await Promise.all([
    getBestSellers(3),
    db.extra.findMany({ orderBy: { name: "asc" } }),
  ]);


  return (
    <section>
      <div className='container'>
        <div className='text-center mb-4'>
          <MainHeading
            subTitle={"checkOut"}
            title={"OurBestSellers"}
          />
        </div>
        <div className="absolute left-0 right-0 w-full mt-7 justify-start hidden md:block">
        <div className="absolute left-0 -top-[70px] text-left -z-10">
          <Image src={'/sallad1.png'} width={109} height={189}  alt={'sallad'} />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
          <Image src={'/sallad2.png'} width={107} height={195} alt={'sallad'} />
        </div>
      </div>
        <Menu items={bestSellers} allExtras={allExtras}/>
      </div>
    </section>
  );
}

export default BestSellers;