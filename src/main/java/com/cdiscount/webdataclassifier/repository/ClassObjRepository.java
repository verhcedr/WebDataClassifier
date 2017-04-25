package com.cdiscount.webdataclassifier.repository;

import com.cdiscount.webdataclassifier.model.ClassObj;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by cedricverhooste on 25/04/17.
 */
@Repository
public class ClassObjRepository extends InMemoryCrudRepository<ClassObj, String> {

    @Override
    public String getId(ClassObj entity) {
        return entity.getCname();
    }
}
