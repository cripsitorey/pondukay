import { UserCircle, Timer, Scroll, Calculator, AlertTriangle, Phone } from "lucide-react";

export default function HowToUse() {
  return (
    <section id="how-to-use" className="mx-auto my-12 max-w-4xl px-4 md:px-8">
      <h2 className="mb-10 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        How&nbsp;to&nbsp;use <span className="text-blue-600">Pondukay</span>
      </h2>

      <ol className="relative border-l pl-6 border-gray-200 dark:border-gray-700 space-y-12">
        {/* Step 1 */}
        <li className="group">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ring-8 ring-white dark:ring-gray-900">
            1
          </span>
          <div className="flex items-start space-x-4">
            <UserCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 group-hover:scale-105 transition-transform" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Introduce tus credenciales de&nbsp;
              <span className="font-semibold">Idukay</span>&nbsp;(usuario y contraseña).
              <br className="md:hidden" />
              Funciona con cuentas de estudiante <em>o</em> padre.
            </p>
          </div>
        </li>

        {/* Step 2 */}
        <li className="group">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ring-8 ring-white dark:ring-gray-900">
            2
          </span>
          <div className="flex items-start space-x-4">
            <Timer className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 group-hover:scale-105 transition-transform" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Pulsa <span className="font-semibold">«Iniciar sesión»</span> y espera unos segundos mientras cargamos tus datos.
            </p>
          </div>
        </li>

        {/* Step 3 */}
        <li className="group">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ring-8 ring-white dark:ring-gray-900">
            3
          </span>
          <div className="flex items-start space-x-4">
            <Scroll className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 group-hover:scale-105 transition-transform" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Desplázate hasta el <span className="font-semibold">final de la página</span> y toca el botón
              <span className="ml-1 inline-block rounded bg-blue-100 px-2 py-0.5 font-semibold text-blue-700">Calcular</span>.
            </p>
          </div>
        </li>

        {/* Step 4 */}
        <li className="group">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ring-8 ring-white dark:ring-gray-900">
            4
          </span>
          <div className="flex items-start space-x-4">
            <Calculator className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 group-hover:scale-105 transition-transform" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              ¡Listo! Verás inmediatamente la nota mínima que necesitas para aprobar cada materia.
            </p>
          </div>
        </li>
      </ol>

      {/* Beta notice */}
      <div className="mt-12 flex items-start rounded-2xl bg-yellow-50 p-6 dark:bg-yellow-900/20">
        <AlertTriangle className="mr-4 h-6 w-6 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
        <p className="text-sm font-medium leading-relaxed text-yellow-800 dark:text-yellow-200">
          Pondukay está en <strong>versión beta</strong>. Si algo no funciona como esperas, escríbenos a&nbsp;
          <a href="tel:+593962736099" className="underline underline-offset-4">096&nbsp;273&nbsp;6099</a> y con gusto te ayudaremos.
        </p>
      </div>
    </section>
  );
}
