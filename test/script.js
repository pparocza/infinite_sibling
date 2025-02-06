import { InfiniteSibling } from "../modules/InfiniteSibling.js";
export const IS = new InfiniteSibling();

function load()
{
    IS.load();
}

function start()
{
    IS.start();
}

function stop()
{
    IS.stop();
}

export { load, start, stop };