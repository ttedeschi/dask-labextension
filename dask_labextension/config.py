from __future__ import absolute_import, division, print_function

import os

import dask
import yaml
from loguru import logger

try:
    logger.add("/var/log/dask_labextension.log")
except PermissionError:
    logger.add(os.path.join(os.path.dirname(__file__), "dask_labextension.log"))

fn = os.path.join(os.path.dirname(__file__), "labextension.yaml")

logger.debug(f"[config][file: {fn}]")
dask.config.ensure_file(source=fn)

with open(fn) as f:
    defaults = yaml.safe_load(f)

dask.config.update_defaults(defaults)
