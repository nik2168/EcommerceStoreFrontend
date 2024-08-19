import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

// to handle mutation reuest functions
const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();

  const handlerFunction = async (toastMessage, ...arg) => {
    setIsLoading(true);
    const toastId = toast.loading(
      toastMessage || "processing your request ..."
    );

    try {
      const res = await mutate(...arg);
      setData(res?.data);
      if (res?.data) {
        toast.success(res?.data?.message || "process completed !", {
          id: toastId,
        });
        // due to toastId the loading toast will be replace by this one
      } else
        toast.error(res?.error?.data?.message || "something went wrong !", {
          id: toastId,
        });
    } catch (err) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };
  return [handlerFunction, isLoading, data];
};

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      // exit function
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
