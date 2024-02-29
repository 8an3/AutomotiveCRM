 git branch -m main main-old  # rename main on local
    git push origin :main          # delete main on remote
    git push origin main-old       # create main-old on remote
    git switch -c main seotweaks # create a new local main on top of seotweaks
    git push origin main           # create main on remote
