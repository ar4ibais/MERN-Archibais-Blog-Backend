import PostModel from "../models/Post.js"

export const Create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}

export const GetAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить статьи"
        })
    }
}

export const GetPopular = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ viewsCount: -1 }).populate('user').exec();
        
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить популярные статьи"
        });
    }
};

export const GetLastTags = async (req, res) => {
    try {
      const posts = await PostModel.find().limit(5).exec();
  
      const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);
  
      res.json(tags);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить тэги',
      });
    }
  };

export const GetOne = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(req.params);
        
        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId
            }, 
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            }
        ).populate('user')

        if (!doc) {
            return res.status(404).json({
                message: "Статья не найдена"
            });
        }

        res.json(doc);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось вернуть статью"
        });
    }
};

export const GetByTag = async (req, res) => {
    try {
        const tag = req.params.tag;

        const posts = await PostModel.find({ tags: tag }).populate('user').exec();
        
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить статьи по тэгу"
        });
    }
}

export const Remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete({ _id: postId });

        if (!doc) {
            return res.status(404).json({
                message: "Статья не найдена"
            });
        }

        res.json({
            message: "Статья успешно удалена"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось удалить статью"
        });
    }
};


export const Update = async (req, res) => {
    try {
        const postId = req.params.id;
        
        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        res.json({
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось обновить статью"
        });
    }
}