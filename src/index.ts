import got from 'got';
import semver from 'semver';
import which from 'which';


const NVCHAD_INSTALL_DOCS_URL = "https://nvchad.com/docs/quickstart/install";
let NEOVIM_VERSION_REGEX = /github\.com\/neovim\/neovim\/releases\/tag\/v(\d+\.\d+\.\d+)/g

async function minimum_neovim_required(url:string) {
  const response = await got(url);
  const body = response.body;
  const result = [...body.matchAll(NEOVIM_VERSION_REGEX)];
  const version = result[0][1]
  return version;
}

async function is_neovim_installed() {
  const result = await which('nvim', { nothrow: true });
  if (result == null) {
    return false;
  }
  return true;
}

async function main() {
  const minimum_version = await minimum_neovim_required(NVCHAD_INSTALL_DOCS_URL);
  const is_installed = await is_neovim_installed();
  console.log(`Minimum Neovim Version Required: ${minimum_version}`);
  console.log(`Is Neovim installed: ${is_installed}`)
}


main().then();
