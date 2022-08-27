import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import * as Boom from "@hapi/boom";

const router = createRouter<NextApiRequest, NextApiResponse>();

const handler = {
  onError: (
    err: unknown,
    req: any,
    res: {
      status: (arg0: number) => void;
      json: (arg0: {
        statusCode?: number;
        error?: string;
        message: string;
      }) => void;
    }
  ) => {
    if (Boom.isBoom(err)) {
      const result = {
        statusCode: err.output.payload.statusCode,
        error: err.output.payload.error,
        message: err.output.payload.message,
        code: -1,
      };
      // add error code
      if (err.data?.code) result.code = err.data?.code;
      res.status(err.output.payload.statusCode);
      res.json(result);
    } else {
      res.status(500);
      res.json({
        message: "Unexpected error",
      });
      console.error(err);
    }
  },
  onNoMatch: (req: any, res: any) => {
    res.status(405).json(Boom.methodNotAllowed().output.payload);
  },
};

export default router;
export { handler };
