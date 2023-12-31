"use client";

import { Loader } from "@/components/ui/loader";
import { CircleLoader } from "react-spinners";

const Loading = () => {
  return (
    <Loader>
      <CircleLoader color="#36d7b7" />
    </Loader>
  );
};

export default Loading;
