import React, { useEffect, useState } from "react";
import { useLazyFetchCompaniesQuery } from "../features/api";
import { useNavigate } from "react-router-dom";
import SectionTitle from "./SectionTitle";

const CompaniesGrid = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState([]);

  const [triggerFetchCompanies] = useLazyFetchCompaniesQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await triggerFetchCompanies();
        const comData = res?.data?.companies || [];
        setCompanyData(comData);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchData();
  }, [triggerFetchCompanies]);

  return (
    <section className="my-3 mt-5 px-4 backdrop-blur-lg">
      {/* <div className="border-b border-base-300 pb-2 mb-1">
        <h2 className="text-3xl font-medium tracking-wide capitalize">
          Top Brands
        </h2>
      </div> */}
            <SectionTitle text={"Top Brands"} />
      

      <div className="flex overflow-x-auto gap-4 py-3 no-scrollbar">
        {companyData.slice(0, companyData.length).map((company) => (
          <button
            key={company?.id}
            onClick={() =>
              navigate(
                `/products?search=&category=all&company=${company?.name}&order=none&price=1000000&shipping=true`
              )
            }
            className="flex-shrink-0 flex flex-col items-center border border-base-300 rounded-lg bg-base-200 p-2 min-w-25 w-25 h-24 shadow hover:shadow-md transition duration-200 ease-in-out"
          >
            <img
              src={company?.image?.url}
              alt={company?.name}
              className="w-16 h-12 object-cover rounded-md mb-2"
            />
            <span className="text-xs font-semibold text-center">
              {company?.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CompaniesGrid;

// import React, { useEffect, useState } from "react";
// import { useLazyFetchCategoriesQuery, useLazyFetchCompaniesQuery } from "../features/api";
// import { useNavigate } from "react-router-dom";

// const CompaniesGrid = () => {

// const navigate = useNavigate();
//   const [companyData, setCompanyData] = useState([]);

//    const [fetchCompanies ] =  useLazyFetchCompaniesQuery();

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const res2 = await fetchCompanies();

//           const comData = res2?.data?.companies

//           setCompanyData(comData);

//         } catch (error) {
//           console.log(error);
//         }
//       };

//       fetchData();
//     }, []);

//   return (
//     <section className="h-auto  mt-[3rem] p-2">
//       <div className="border-b border-base-300 pb-0">
//         <h2 className="text-3xl font-medium tracking-wider capitalize">
//           Top Brands
//         </h2>
//       </div>
//       <div className="flex flex-row justify-center w-full h-auto items-center overflow-auto gap-3 py-3">
//         {companyData.slice(1, 20).map((company) => (
//           <button
//             onClick={() =>
//               navigate(
//                 `/products?search=&category=all&company=${company.name}&order=none&price=1000000&shipping=true`
//               )
//             }
//             key={company.id}
//             className="flex flex-col  items-center hover:cursor-pointer justify-center bg-base-200 p-2 w-[8rem] h-[6rem] rounded-lg shadow hover:shadow-md transition"
//           >
//             <img
//               src={company.image.url}
//               alt={company.name}
//               className="w-[4rem] h-[3rem] object-cover rounded-md mb-2"
//             />
//             <span className="text-[0.7rem] text-center font-semibold text-wrap">
//               {company.name}
//             </span>
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default CompaniesGrid;
