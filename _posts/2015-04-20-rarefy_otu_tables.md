---
layout: post
category : microbiome
tagline: ""
tags : [microbiome, otu, otu table, rarefaction]
---
{% include JB/setup %}


## Do not rarefy OTU tables!
This paper came last year, but always relevant as I still see rarefied OTU tables in papers. Which is normal because this a widely spread method of putting all samples on the same scale (or sequencing depth). I implemented normalization with edgeR in my rRNA pipeline and it works fine. End results are quite similar with the ones obtained with rarefied tables, but this is indeed a more robust way of doing things. I definitely wouldn’t throw the brick to a authors using rarefaction as a way of normalizing data, but we should progressively move away from this method.

http://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003531

“Well-established statistical theory is available that simultaneously accounts for library size differences and biological variability using an appropriate mixture model. Moreover, specific implementations for DNA sequencing read count data (based on a Negative Binomial model for instance) are already available in RNA-Seq focused R packages such as edgeR and DESeq.”