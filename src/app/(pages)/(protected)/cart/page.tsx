"use client";
import React from "react";
import CartComponent from "@/components/CartComponent";

const CartPage = () => {
  // const [test, setTest] = React.useState(null);
  // React.useEffect(() => {
  //   const fetchImage = async () => {
  //     const urlData = await appwriteService.getFileFromBucket({ key: "101" });
  //     setTest(urlData);
  //     console.log(urlData);
  //   };
  //   fetchImage();
  // }, []);
  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      <CartComponent />
    </div>
  );
};

export default CartPage;
