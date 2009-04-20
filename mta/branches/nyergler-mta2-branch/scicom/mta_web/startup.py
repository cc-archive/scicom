import os
import sys
import zdaemon.zdctl

def zdaemon_controller(zdaemon_conf='zdaemon.conf'):
    args = ['-C', zdaemon_conf] + sys.argv[1:]
    zdaemon.zdctl.main(args, options=None)
