import { createCors } from "itty-cors"
import { IRequest, Router } from "itty-router"

import { ExecutionContext } from "@cloudflare/workers-types"
import {
  internalServerError,
  notFound,
  temporaryRedirect,
} from "@worker-tools/response-creators"

import { notifier } from "./notify"
import { v1Router } from "./routes/v1"

const router = Router<IRequest, [Env, ExecutionContext]>()

const { preflight, corsify } = createCors({
  methods: ["GET"],
  origins: ["*"],
  maxAge: 7200,
})

router.all<IRequest, [Env, ExecutionContext]>("*", preflight)

router.all<IRequest, [Env, ExecutionContext]>("/v1/*", v1Router.handle)

router.get<IRequest, [Env, ExecutionContext]>("/", () =>
  temporaryRedirect("https://github.com/BeeeQueue/dota-matches-api"),
)

router.all<IRequest, [Env, ExecutionContext]>("*", () => notFound())

const worker: ExportedHandler<Env> = {
  fetch: (...args) =>
    router
      .handle(...args)
      .catch((error: Error) => {
        console.error(error)
        return internalServerError("Something went wrong!")
      })
      .then(corsify),
  scheduled: notifier,
}

export default worker
