// import {
//   createContext,
//   useCallback,
//   useMemo,
//   ReactNode,
//   FC,
// } from 'react';
// import { useSearchParams } from 'react-router-dom';

// // Define types for parameter configuration and context
// export type URLParamConfig<T = any> = {
//   name: string;
//   validate: (value: string | null) => T | null;
//   defaultValue: T;
// };

// type URLParamsContextType<T = any> = {
//   [key in keyof T]: T[key];
// } & {
//   setParam: (paramName: keyof T, newValue: any) => void;
// };

// // Function to create a generic URL parameters context
// export const createURLParamsContext = <T extends object>(
//   paramConfigs: URLParamConfig[],
// ): {
//   URLParamsContext: React.Context<URLParamsContextType<T>>;
//   URLParamsProvider: FC<{ children: ReactNode }>;
// } => {
//   const defaultValues: Partial<T> = {};
//   paramConfigs.forEach(({ name, defaultValue }) => {
//     defaultValues[name as keyof T] = defaultValue;
//   });

//   const URLParamsContext = createContext<
//     URLParamsContextType<T>
//   >({
//     ...(defaultValues as T),
//     setParam: () => {},
//   });

//   const URLParamsProvider: FC<{ children: ReactNode }> = ({
//     children,
//   }) => {
//     const [searchParams, setSearchParams] =
//       useSearchParams();

//     const params: Partial<T> = {};
//     paramConfigs.forEach(
//       ({ name, validate, defaultValue }) => {
//         params[name as keyof T] =
//           validate(searchParams.get(name)) || defaultValue;
//       },
//     );

//     const setParam = useCallback(
//       (paramName: string, newValue: string) => {
//         const newSearchParams = new URLSearchParams(
//           searchParams,
//         );
//         newSearchParams.set(paramName, newValue);
//         setSearchParams(newSearchParams);
//       },
//       [searchParams, setSearchParams],
//     );

//     const value = useMemo(
//       () => ({ ...(params as T), setParam }),
//       [params, setParam],
//     );

//     return (
//       <URLParamsContext.Provider
//         value={value as URLParamsContextType<T>}
//       >
//         {children}
//       </URLParamsContext.Provider>
//     );
//   };

//   return { URLParamsContext, URLParamsProvider };
// };
