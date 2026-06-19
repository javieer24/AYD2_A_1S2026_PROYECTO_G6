import ConsoleLayout from "../../layouts/ConsoleLayout";
import "./VerificarPage.css";
import searchIcon from "../../assets/search-globe-svgrepo-com.svg";

function VerificarPage() {
  return (
    <main>
      <ConsoleLayout title="Verificacion de certificado">
        <div className="p-4 rounded-md">
          <div className="flex items-center gap-3 p-2">
            <div className="relative flex-1">
              <img
                src={searchIcon}
                className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 opacity-60"
                alt="searchIcon"
              />
              <input
                className="w-full rounded-lg bg-white border border-gay-300 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Ingrese codigo de certificado"
                type="text"
                name=""
                id=""
              />
            </div>
            <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700">
              Verificar
            </button>
          </div>
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl text-green-600">✓</span>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Certificado válido
                </h2>
                <p className="text-sm text-gray-500">
                  La información coincide con nuestros registros.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium text-gray-800">Juan José Gerardi</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Código</p>
                <p className="font-medium text-gray-800">CERT-2026-001</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Programa</p>
                <p className="font-medium text-gray-800">Desarrollo Web</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Fecha de emisión</p>
                <p className="font-medium text-gray-800">19/06/2026</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Institución</p>
                <p className="font-medium text-gray-800">Universidad XYZ</p>
              </div>
            </div>
          </div>
        </div>
      </ConsoleLayout>
    </main>
  );
}

export default VerificarPage;
