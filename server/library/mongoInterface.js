/*
 * Creates a new instance of the specified model, sets its attributes, and saves it to the mongodb instance.
 * Sends a response back to the client
 */
var addModelInstance = function(model, res, params) {
    var modelInstance = new model();
    for (key in params) {
        modelInstance[key] = params[key];
    }

    modelInstance.save(function(err) {
        if (err) {
            res.status(500).json({ message: 'Error! There was a problem adding to the database.'});
        }
        else {
            res.status(201).json({ message: 'New data object was added!',
                                   data: modelInstance });
        }
    });
};

module.exports = {

    /*
     * Checks if a id,val pair exists for the specified model and adds a new instance with the given parameters if it doesn't.
     */
    findAndAdd : function(id, val, model, res, params) {
        var query = {};
        query[id] = val;
        model.findOne(query, function(err, doc) {
            if (doc) {
                res.status(500).json({ message: 'Error!' + id + ' already exists.'});
            }
            else {
                addModelInstance(model, res, params);          
            }
        });  
    },

    /**
     * Adds a model directly to the mongoDB without sending a response back to the user
     */
    addModelInstanceToDB: function(model, params, callback) {
        var modelInstance = new model();
        for (key in params) {
            modelInstance[key] = params[key];
        }

        modelInstance.save(function(err) {
            if (err) {
                callback(err, null);
            }
            else {
               callback(null, 'Instance added successfully')
            }
        });
    },

    /**
     * Finds and deletes a specified model according to the given id and value pair
     */
    findAndDelete : function(id, val, model, res) {
        var query = {};
        query[id] = val;
        model.findOne(query, function(err, doc) {
            if (doc) {
                doc.remove();
                res.status(200).json({ message: 'Deleted data object.'});
            }
            else {
                res.status(404).json({ message: 'Error! id was not found: ' + val });      
            }
        });
    }
};