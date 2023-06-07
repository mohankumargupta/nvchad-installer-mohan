import got from 'got';


const NVCHAD_INSTALL_DOCS_URL = "https://nvchad.com/docs/quickstart/install";
let NEOVIM_VERSION_REGEX = /(script)/g;

async function neovim_version(url:string) {
  const response = await got(url);
  const body = response.body;
  console.log(body);
  const regex = NEOVIM_VERSION_REGEX.toString();
  console.log(regex);
  const result = [...body.matchAll(/v(\d+)\.(\d+)\.(\d+)/g)];
  console.log(result);
  const major_version = result[0][1];
  console.log(major_version);
  const minor_version = result[0][2];
  console.log(minor_version);
  const patch_version = result[0][3];
  console.log(patch_version);
  

}

async function main() {
  const version = await neovim_version(NVCHAD_INSTALL_DOCS_URL);
}


main().then();
