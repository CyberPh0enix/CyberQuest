{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [ 
    pkgs.git
  ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    npm.enable = true;
  };

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo Workspace ready. Run 'npm run dev' to start.";

  enterShell = ''
    hello
  '';

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks = {
    shellcheck.enable = true;
  };
}
