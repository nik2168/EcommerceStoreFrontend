import React, { useEffect, useState } from "react";
import { useLazyFetchCategoriesQuery, useLazyFetchCompaniesQuery } from "../features/api";
import { useNavigate } from "react-router-dom";

const CategoryGrid = () => {

const navigate = useNavigate();
  const [companyData, setCompanyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  
   
  
  
  const [fetchCategories ] = useLazyFetchCategoriesQuery();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res1 = await fetchCategories();
  
          const catData = res1?.data?.categories
  
          setCategoryData(catData);
         
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchData();
    }, []);


  return (
    <section className="h-auto overflow-y-auto  p-2 border-t-4 border-base-100  mb-6">
      {/* <div className="border-b border-base-300 pb-0">
        <h2 className="text-3xl font-medium tracking-wider capitalize">
          Shop By Category
        </h2>
      </div> */}
      <div className="flex  md:justify-center lg:justify-center overflow-x-auto gap-3  no-scrollbar">
        {categoryData?.slice(1, categoryData.length).map((category) => (
          <button
            onClick={() =>
              navigate(
                `/products?search=&category=${category?.name}&company=all&order=none&price=1000000&shipping=true`
              )
            }
            key={category._id}
            className="flex flex-col min-w-[5rem] sm:min-w-[6rem] items-center hover:cursor-pointer justify-center border border-base-300 rounded-lg bg-base-200 p-2 shadow hover:shadow-md transition"
          >
            <img
              src={category.image.url}
              alt={category.name}
              className="w-[4rem] md:w-[5rem] lg:w-[5rem] h-[3rem] md:h-[4rem] lg:h-[4rem] object-cover rounded-md mb-2"
            />
            <span className="text-[0.7rem] text-center font-semibold">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
