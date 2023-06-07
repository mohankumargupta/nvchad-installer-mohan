import { intro, outro, confirm, select } from '@clack/prompts';
import pc from 'picocolors';
import got from 'got';
import semver from 'semver';
import which from 'which';
import { setTimeout } from 'timers/promises';
import ora from 'ora';
import { execa } from 'execa';

const TIMEOUT_FOR_EFFECT = 4000;

async function is_internet_connected() {
  let isConnected = !!await require('dns').promises.resolve('google.com').catch(()=>{});
  return isConnected;
}

async function minimum_neovim_required(url:string) {
  const NEOVIM_VERSION_REGEX = /github\.com\/neovim\/neovim\/releases\/tag\/v(\d+\.\d+\.\d+)/g;
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

async function installed_neovim_version() {
  const {stdout} = await execa('nvim', ['--version']);
  const NEOVIM_REGEX = /NVIM v(\d+.\d+.\d+)/g;
  const result = [...stdout.matchAll(NEOVIM_REGEX)];
  const version = result[0][1];
  return version;
}

async function find_config_directory() {
  const {stdout, stderr} = await execa('nvim', ['--clean', '--headless', '-c', ':echo stdpath("config")', '-c',  'q!']);
  return stderr;
}

async function prompt_check_neovim() {
  intro(pc.green("Welcome to the unofficial NVChad Installer."));
  const spinner = ora("Checking internet connection").start();
  const internet_alive = await is_internet_connected();
  await setTimeout(TIMEOUT_FOR_EFFECT);
  if (internet_alive) {
    spinner.succeed("Internet connected.")
  }
  else {
    spinner.fail("Internet not connected.");
    outro("Need a working internet connection. Sorry");
    process.exit(1);
  }
}

async function prompt_find_neovim() {
  const spinner = ora("Finding neovim in path").start();
  await setTimeout(TIMEOUT_FOR_EFFECT);
  const is_installed = await is_neovim_installed();
  if (is_installed) {
    spinner.succeed("Neovim found.")   
  }
  else {
    spinner.fail("Neovim not found.");
    outro("Please install Neovim on your system.");
    process.exit(1);
  }
  
}

async function prompt_required_neovim_version() {
  const NVCHAD_INSTALL_DOCS_URL = "https://nvchad.com/docs/quickstart/install";
  const spinner = ora(`Checking ${NVCHAD_INSTALL_DOCS_URL} for minimum Neovim required`).start();
  await setTimeout(TIMEOUT_FOR_EFFECT);
  const required_version = await minimum_neovim_required(NVCHAD_INSTALL_DOCS_URL);
  spinner.text = `Version required: ${required_version} `;
  await setTimeout(TIMEOUT_FOR_EFFECT);
  //spinner.text = `Finding installed Neovim version`;
  const installed_version = await installed_neovim_version();
  await setTimeout(TIMEOUT_FOR_EFFECT);
  const prereq = semver.lt(required_version, installed_version);
  if (prereq) {
    spinner.succeed(`Installed Neovim version: v${installed_version}`);
  }

  else {
    spinner.fail(`Installed version of Neovim v${installed_version} is less than required: v${required_version}`);
    process.exit(2);
  }
}

async function prompt_find_config_directory() {
  const spinner = ora(`Finding config directory`).start();
  await setTimeout(5000);
  const config_directory = await find_config_directory();
  spinner.succeed(`Found config directory: ${config_directory}`);
  await setTimeout(5000);
}

export default async function installer() {
  await prompt_check_neovim();
  await prompt_find_neovim();
  await prompt_required_neovim_version();
  await prompt_find_config_directory();
  outro("Bye Bye.");
}








